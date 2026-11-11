export const validatePrompt = (prompt, tag) => {
  const errors = {};

  if (!prompt || typeof prompt !== 'string') {
    errors.prompt = 'Prompt is required';
  } else if (prompt.trim().length < 10) {
    errors.prompt = 'Prompt must be at least 10 characters';
  } else if (prompt.length > 5000) {
    errors.prompt = 'Prompt exceeds 5000 character limit';
  }

  if (!tag || typeof tag !== 'string') {
    errors.tag = 'Tag is required';
  } else if (!/^#?[a-zA-Z0-9]+$/.test(tag)) {
    errors.tag = 'Tag can only contain letters, numbers, and #';
  } else if (tag.length > 50) {
    errors.tag = 'Tag exceeds 50 character limit';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
