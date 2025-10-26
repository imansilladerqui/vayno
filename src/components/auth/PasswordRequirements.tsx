export const PasswordRequirements = () => (
  <div className="text-xs text-gray-400 space-y-1">
    <p className="font-medium text-gray-300">Password Requirements:</p>
    <ul className="space-y-1 ml-2">
      <li>• At least 8 characters long</li>
      <li>• Contains uppercase and lowercase letters</li>
      <li>• Contains numbers and special characters</li>
      <li>• Not found in known data breaches (HaveIBeenPwned)</li>
    </ul>
  </div>
);
