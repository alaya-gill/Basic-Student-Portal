# Generated by Django 3.1.6 on 2021-02-02 16:50

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0005_auto_20210202_2143'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='phone',
            field=models.CharField(max_length=14, validators=[django.core.validators.RegexValidator(message='Phone number must be entered in the format: 05999999999', regex='^((\\+92)|(0092))-{0,1}3{1}\\d{2}-{0,1}\\d{7}$|^0{0,1}3{1}\\d{10}$|^0{0,1}3{1}\\d{2}-\\d{7}$')]),
        ),
    ]
