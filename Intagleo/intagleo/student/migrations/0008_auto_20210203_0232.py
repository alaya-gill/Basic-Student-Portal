# Generated by Django 3.1.6 on 2021-02-02 21:32

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0007_auto_20210203_0230'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='phone',
            field=models.CharField(max_length=14, validators=[django.core.validators.RegexValidator(message='Phone number must be entered in the format: +923006860265', regex='^((\\+92)|(0092))-{0,1}3{1}\\d{2}-{0,1}\\d{7}$|^0{0,1}3{1}\\d{10}$|^0{0,1}3{1}\\d{2}-\\d{7}$')]),
        ),
    ]
