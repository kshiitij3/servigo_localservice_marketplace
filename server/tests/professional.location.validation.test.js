import test from 'node:test';
import assert from 'node:assert/strict';

import {
  updateProfessionalLocationValidation,
} from '../validations/professional.validation.js';

test('professional location validation export exists and contains location validators', () => {
  assert.ok(Array.isArray(updateProfessionalLocationValidation));
  assert.ok(updateProfessionalLocationValidation.length >= 2);
});
