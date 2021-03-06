# Generated by Django 3.1.6 on 2021-02-02 16:24

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('roll_no', models.IntegerField(db_index=True, unique=True, validators=[django.core.validators.MaxLengthValidator(3), django.core.validators.MinLengthValidator(3)])),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('phone', models.IntegerField(max_length=14)),
                ('address', models.CharField(max_length=300)),
            ],
        ),
    ]
