/**
 * Password validation utilities for enhanced security
 */

export interface PasswordStrength {
  score: number; // 0-4 (weak to very strong)
  feedback: string[];
  isValid: boolean;
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxLength: number;
}

const defaultRequirements: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
};

const commonPasswords = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
  'iloveyou', '123123', 'admin123', 'welcome123', 'password!', 'qwerty123'
];

/**
 * Validates password strength and security requirements
 */
export function validatePassword(
  password: string, 
  requirements: PasswordRequirements = defaultRequirements,
  userInfo?: { email?: string; name?: string; company?: string }
): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Length checks
  if (password.length < requirements.minLength) {
    feedback.push(`Password must be at least ${requirements.minLength} characters long`);
  } else if (password.length >= requirements.minLength) {
    score += 1;
  }

  if (password.length > requirements.maxLength) {
    feedback.push(`Password must be less than ${requirements.maxLength} characters long`);
  }

  // Character type checks
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }

  if (requirements.requireNumbers && !/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else if (/\d/.test(password)) {
    score += 1;
  }

  if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    feedback.push('Password must contain at least one special character (!@#$%^&*...)');
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    score += 1;
  }

  // Common password check
  if (commonPasswords.includes(password.toLowerCase())) {
    feedback.push('This password is too common. Please choose a more unique password');
    score = Math.max(0, score - 2);
  }

  // Personal information check
  if (userInfo) {
    const personalInfo = [
      userInfo.email?.split('@')[0],
      userInfo.name?.toLowerCase(),
      userInfo.company?.toLowerCase()
    ].filter(Boolean);

    for (const info of personalInfo) {
      if (info && password.toLowerCase().includes(info)) {
        feedback.push('Password should not contain personal information');
        score = Math.max(0, score - 1);
        break;
      }
    }
  }

  // Pattern checks
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeating the same character more than twice');
    score = Math.max(0, score - 1);
  }

  if (/123456|abcdef|qwerty/i.test(password)) {
    feedback.push('Avoid common patterns like "123456" or "qwerty"');
    score = Math.max(0, score - 1);
  }

  // Bonus points for additional complexity
  if (password.length >= 12) score += 1;
  if (/[^\w\s]/.test(password)) score += 1; // Additional special characters
  if (password.length >= 16) score += 1;

  const isValid = feedback.length === 0 && score >= 3;

  return {
    score: Math.min(score, 4),
    feedback,
    isValid
  };
}

/**
 * Get password strength description
 */
export function getPasswordStrengthText(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'Very Weak';
    case 2:
      return 'Weak';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Very Weak';
  }
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'text-red-600';
    case 2:
      return 'text-orange-600';
    case 3:
      return 'text-yellow-600';
    case 4:
      return 'text-green-600';
    default:
      return 'text-red-600';
  }
}

/**
 * Generate password strength progress bar width
 */
export function getPasswordStrengthWidth(score: number): string {
  return `${(score / 4) * 100}%`;
}