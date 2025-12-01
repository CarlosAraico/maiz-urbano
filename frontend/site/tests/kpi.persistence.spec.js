import { test, expect } from '@playwright/test';

test('KPIs persisten con 2 samples', async ({ page }) => {
  await page.goto('/facturacion/login');
  await page.getByLabel('Email').fill('kpi@mu.mx');
  await page.getByLabel('Password').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();

  for (let i = 0; i < 2; i++) {
    await page.getByLabel('RFC').fill('MUAX010101ABC');
    await page.getByLabel('Ticket').fill(String(100000 + i));
    await page.getByLabel('Monto').fill('100.00');
    await page.getByRole('button', { name: 'Registrar Solicitud' }).click();
    await expect(page.getByText('Solicitud registrada. Folio:')).toBeVisible();
  }

  await page.goto('/facturacion/dashboard');
  await expect(page.getByText('Dashboard')).toBeVisible();
  await expect(page.getByText('Total facturado')).toBeVisible();
  await expect(page.getByText('Solicitudes')).toBeVisible();
});
