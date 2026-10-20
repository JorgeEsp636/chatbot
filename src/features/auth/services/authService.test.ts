import assert from 'node:assert/strict';
import test from 'node:test';

import { AuthService, CUENTAS_DEMO_UBATE } from './authService';

test('no debe haber cuentas demo ni sesión automática predefinida', () => {
  assert.deepEqual(CUENTAS_DEMO_UBATE, []);

  const service = new AuthService();
  assert.equal(service.getUsuarioActual(), null);
});
