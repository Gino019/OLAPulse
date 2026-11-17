"""Recreate OLAPulse synthetic transactions (no personal data)."""
from datetime import date, timedelta
from pathlib import Path
import csv
import random

RNG = random.Random(20261117)
PRODUCTS = {
    'Electronics': [('Laptop Pro', 1280, .69), ('Wireless Headphones', 180, .54), ('4K Monitor', 390, .63), ('Smart Tablet', 540, .65)],
    'Furniture': [('Office Chair', 270, .61), ('Standing Desk', 610, .68), ('Bookshelf', 195, .62), ('Desk Lamp', 85, .52)],
    'Office Supplies': [('Printer Paper', 28, .44), ('Notebook Set', 24, .39), ('Ink Cartridges', 75, .48), ('Organizer Kit', 55, .42)],
    'Accessories': [('USB-C Dock', 135, .56), ('Laptop Sleeve', 42, .48), ('Webcam HD', 110, .57), ('Ergonomic Mouse', 76, .51)],
}
REGIONS = ['North', 'South', 'East', 'West']
CHANNELS = ['Online', 'Retail', 'Partner']
SEGMENTS = ['Consumer', 'Small Business', 'Enterprise']
FIRST_DAY = date(2023, 1, 1)
DAYS = (date(2025, 12, 31) - FIRST_DAY).days + 1
OUTPUT = Path(__file__).resolve().parent.parent / 'public' / 'data' / 'sales.csv'


def generate():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open('w', newline='', encoding='utf-8') as output:
        writer = csv.writer(output)
        writer.writerow(['order_id', 'order_date', 'region', 'category', 'product', 'channel', 'segment', 'quantity', 'unit_price', 'discount', 'revenue', 'profit'])
        for number in range(1, 4801):
            order_date = FIRST_DAY + timedelta(days=RNG.randrange(DAYS))
            region = RNG.choices(REGIONS, weights=[.32, .22, .26, .20])[0]
            category = RNG.choices(list(PRODUCTS), weights=[.34, .23, .25, .18])[0]
            product, base_price, cost_factor = RNG.choice(PRODUCTS[category])
            channel = RNG.choices(CHANNELS, weights=[.48, .34, .18])[0]
            segment = RNG.choices(SEGMENTS, weights=[.58, .28, .14])[0]
            quantity = RNG.choices([1, 2, 3, 4, 5, 8], weights=[.39, .27, .15, .10, .06, .03])[0]
            unit_price = round(base_price * RNG.uniform(.91, 1.13), 2)
            discount = RNG.choice([0, 0, .03, .05, .08, .10, .15])
            revenue = round(unit_price * quantity * (1 - discount), 2)
            cost = round(unit_price * quantity * cost_factor, 2)
            writer.writerow([f'OP-{number:05}', order_date.isoformat(), region, category, product, channel, segment, quantity, f'{unit_price:.2f}', f'{discount:.2f}', f'{revenue:.2f}', f'{revenue - cost:.2f}'])
    print(f'Generated 4,800 synthetic transactions: {OUTPUT}')


if __name__ == '__main__':
    generate()
