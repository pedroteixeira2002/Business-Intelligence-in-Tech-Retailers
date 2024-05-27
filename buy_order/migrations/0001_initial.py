# Generated by Django 5.0.4 on 2024-05-20 19:53

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BuyOrder',
            fields=[
                ('number', models.CharField(max_length=30, primary_key=True, serialize=False, unique=True)),
                ('date', models.DateField()),
                ('tipo', models.CharField(max_length=2)),
            ],
        ),
    ]
