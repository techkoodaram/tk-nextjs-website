'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FormField {
  fieldName: string;
  label: string;
  fieldType: string;
  isRequired: boolean;
  options?: string[];
}

interface EventRegistrationFormProps {
  eventId: string;
  fields: FormField[];
  title?: string;
  description?: string;
}

export default function EventRegistrationForm({
  eventId,
  fields,
  title,
  description,
}: EventRegistrationFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          candidateData: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center border border-border/50 rounded-lg bg-green-50/5 dark:bg-green-900/10 text-green-700 dark:text-green-400">
        <h3 className="text-2xl font-bold mb-2">Registration Successful!</h3>
        <p>Thank you for registering. We look forward to seeing you at the event.</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 md:p-8 rounded-lg border border-border/50 shadow-sm">
      {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
      {description && <p className="text-muted-foreground mb-6">{description}</p>}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.fieldName} className="space-y-2">
            <label htmlFor={field.fieldName} className="block text-sm font-medium">
              {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>

            {field.fieldType === 'textarea' ? (
              <textarea
                id={field.fieldName}
                required={field.isRequired}
                onChange={(e) => handleChange(field.fieldName, e.target.value)}
                className="w-full flex min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            ) : field.fieldType === 'select' ? (
              <select
                id={field.fieldName}
                required={field.isRequired}
                onChange={(e) => handleChange(field.fieldName, e.target.value)}
                className="w-full flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select an option...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.fieldType === 'checkbox' ? (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={field.fieldName}
                  required={field.isRequired}
                  onChange={(e) => handleChange(field.fieldName, e.target.checked ? 'Yes' : 'No')}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">Yes</span>
              </div>
            ) : (
              <input
                type={field.fieldType || 'text'}
                id={field.fieldName}
                required={field.isRequired}
                onChange={(e) => handleChange(field.fieldName, e.target.value)}
                className="w-full flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            )}
          </div>
        ))}

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </form>
    </div>
  );
}
