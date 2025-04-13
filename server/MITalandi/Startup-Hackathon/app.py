
#

from test import stem
from test import preprocessing
from test import desc_similarity
import json


import streamlit as st
import numpy as np
import pandas as pd
import spacy
import nltk
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem.porter import PorterStemmer

import warnings
pd.set_option('display.max_columns', None)
warnings.filterwarnings('ignore')
results = []

# Load NLP tools
nlp = spacy.load('en_core_web_sm')
stop_words = nlp.Defaults.stop_words
ps = PorterStemmer()

# Load CSV file
df = pd.read_csv("startups.csv")

# Copy and select necessary columns
df1 = df.copy()
df_f = df1[['company', 'sector', 'description', 'amount']]

# Sidebar UI
st.sidebar.title("Capital Catalyst")
st.sidebar.markdown("Give us a few details about the domain you want to invest in:")

# Amount selection
options = [
    '100000 & below', '1000000 & below', '5000000 & below',
    '10000000 & below', '50000000 & below', '100000000 & below',
    '1000000000 & below', '5000000000 & below',
    '50000000000 & below', '10000000000 & below'
]
amount = st.sidebar.selectbox("Amount", options)
a1 = int(re.sub("[^0-9]", "", amount))

# Sector and description input
s1 = st.sidebar.selectbox("Sector", df_f["sector"].dropna().unique())
d1 = st.sidebar.text_area("Please enter a description of your app:")

# Main UI
st.title("Capital Catalyst")
st.markdown("Platform of Startup Fortunes")

if st.sidebar.button("Submit"):
    d = {
        'company': '',
        'sector': s1,
        'description': d1,
        'amount': a1
    }
    d = pd.DataFrame([d])
    df_f = pd.concat([df_f, d], axis=0, ignore_index=True)

    a = desc_similarity(df_f, "description", "amount")


    num_rows = len(a)
    for i in range(num_rows):
        company_data = {
            "rank": i + 1,
            "company": df['company'].iloc[a[i]],
            "founded_year": df.get('founded', pd.Series(['N/A'] * len(df))).iloc[a[i]],
            "headquarters": df.get('headquarters', pd.Series(['N/A'] * len(df))).iloc[a[i]],
            "sector": df['sector'].iloc[a[i]],
            "description": df['description'].iloc[a[i]],
            "founder": df.get('founder', pd.Series(['N/A'] * len(df))).iloc[a[i]],
            "amount_of_investment_required": str(df['amount'].iloc[a[i]])
        }
        results.append(company_data)

        with st.container():
            st.title(f"#{i + 1} - {company_data['company']}")
            st.text(f"Founded Year : {company_data['founded_year']}")
            st.text(f"Headquarters : {company_data['headquarters']}")
            st.text(f"Sector : {company_data['sector']}")
            st.write(f"Description : {company_data['description']}")
            st.text(f"Founder : {company_data['founder']}")
            st.text(f"Amount of investment required : {company_data['amount_of_investment_required']}")

        with open("investment_recommendations.json", "w") as f:
            json.dump(results, f, indent=4)