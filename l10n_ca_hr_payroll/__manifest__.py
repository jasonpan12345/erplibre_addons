
{
    'name': 'Canadian Payroll',
    'category': 'Human Resources',
    'author': 'Mathieu Benoit <mathben@technolibre.ca>',
    'depends': ['hr_payroll', 'l10n_ca'],
    'description': """
Canadian Payroll Rules.
=======================

    """,
    'data': [
        'data/hr_income_tax_exemption.xml',
        'data/salary_rules/base.xml',
        'data/salary_rules/ben.xml',
        'data/salary_rules/ei.xml',
        'data/salary_rules/cpp.xml',
        'data/salary_rules/fit.xml',
        'data/salary_rules/pension_plans.xml',
        'data/salary_rules/vacation.xml',
        'data/salary_rules/public_holidays.xml',
        'data/salary_rules/sick_leaves.xml',
        'data/salary_rules/compensatory.xml',
    ],
}
