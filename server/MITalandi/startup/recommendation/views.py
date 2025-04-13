from django.shortcuts import render

# Create your views here.
import json
import re
import pandas as pd
import numpy as np
import spacy
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .test import desc_similarity  # Your logic moved here
from nltk.stem.porter import PorterStemmer

# Load NLP model
nlp = spacy.load("en_core_web_sm")
stop_words = nlp.Defaults.stop_words
ps = PorterStemmer()
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, 'startups_unique_companies.csv')
df = pd.read_csv(csv_path)
# Load data
# df = pd.read_csv("startups.csv")
df1 = df.copy()
df_f = df1[['company', 'sector', 'description', 'amount']]


@api_view(['POST'])
def get_recommendations(request):
    sector = request.data.get("sector")
    description = request.data.get("description")
    amount = request.data.get("amount")

    # Clean amount input
    amount = int(re.sub("[^0-9]", "", str(amount)))

    # Append the new input
    new_row = pd.DataFrame([{
        'company': '',
        'sector': sector,
        'description': description,
        'amount': amount
    }])
    df_combined = pd.concat([df_f, new_row], axis=0, ignore_index=True)

    indices = desc_similarity(df_combined, "description", "amount")

    results = []
    for i, idx in enumerate(indices):
        company_data = {
            "rank": i + 1,
            "company": df['company'].iloc[idx],
            "founded_year": df.get('founded', pd.Series(['N/A'] * len(df))).iloc[idx],
            "headquarters": df.get('headquarters', pd.Series(['N/A'] * len(df))).iloc[idx],
            "sector": df['sector'].iloc[idx],
            "description": df['description'].iloc[idx],
            "founder": df.get('founder', pd.Series(['N/A'] * len(df))).iloc[idx],
            "amount_of_investment_required": str(df['amount'].iloc[idx])
        }
        results.append(company_data)

    return Response(results)