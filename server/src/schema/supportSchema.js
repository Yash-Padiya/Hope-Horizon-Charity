const { z } = require('zod');

const supportSchema = z.object({
  query: z.string().min(5, 'Query must be at least 5 characters long').max(300, 'Query must be at most 300 characters long'),
});

module.exports = { supportSchema };