# Generated by Django 5.0.4 on 2024-05-14 15:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('invoices', '__first__'),
        ('products', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='InvoiceLines',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.DecimalField(decimal_places=10, max_digits=19)),
                ('unit_price', models.DecimalField(decimal_places=10, max_digits=19)),
                ('credit_amount', models.FloatField()),
                ('invoice_no', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='invoices.invoice')),
                ('product_code', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.product')),
            ],
        ),
    ]
