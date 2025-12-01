import { test, expect } from '@playwright/test';

test('OCR mock: sube imagen y autocompleta', async ({ page }) => {
  await page.goto('/facturacion/login');
  await page.getByLabel('Email').fill('qa@mu.mx');
  await page.getByLabel('Password').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText('Solicitud de Factura')).toBeVisible();
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByText('Subir ticket (OCR)').click();
  const chooser = await fileChooserPromise;
  await chooser.setFiles({ name: 'ticket.png', mimeType: 'image/png', buffer: Buffer.from([137,80,78,71]) });

  await expect(page.getByText('Datos capturados por OCR')).toBeVisible();
  await expect(page.getByLabel('RFC')).toHaveValue('MUAX010101ABC');
  await expect(page.getByLabel('Ticket')).toHaveValue('123456');
  await expect(page.getByLabel('Monto')).toHaveValue('248.5');
});
