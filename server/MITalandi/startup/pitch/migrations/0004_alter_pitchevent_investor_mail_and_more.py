# Generated by Django 5.1.4 on 2025-04-12 06:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pitch', '0003_pitchevent_investor_mail_pitchevent_startup_mail'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pitchevent',
            name='investor_mail',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name='pitchevent',
            name='startup_mail',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
