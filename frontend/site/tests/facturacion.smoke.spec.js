import { test, expect } from '@playwright/test';

test('login ? solicitud ? consulta ? dashboard', async ({ page }) => {
  await page.goto('/facturacion/login');
  await expect(page.getByText('Acceso · Facturación')).toBeVisible();

  await page.getByLabel('Email').fill('tester@mu.mx');
  await page.getByLabel('Password').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText('Solicitud de Factura')).toBeVisible();
  await page.getByLabel('RFC').fill('MUAX010101ABC');
  await page.getByLabel('Ticket').fill('123456');
  await page.getByLabel('Monto').fill('248.50');
  await page.getByRole('button', { name: 'Registrar Solicitud' }).click();
  await expect(page.getByText('Solicitud registrada. Folio:')).toBeVisible();

  await page.goto('/facturacion/consulta');
  await page.getByPlaceholder('RFC').fill('MUAX010101ABC');
  await page.getByPlaceholder('Ticket').fill('123456');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByText('MUAX010101ABC')).toBeVisible();

  await page.goto('/facturacion/dashboard');
  await expect(page.getByText('Dashboard')).toBeVisible();
});
