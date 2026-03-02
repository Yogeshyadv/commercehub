import { Plus, X, Trash2 } from 'lucide-react';
import Button from '../common/Button';

export default function SpecificationsBuilder({ specifications = [], onChange }) {
  const addSpecification = () => {
    onChange([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index, field, value) => {
    const updated = specifications.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    );
    onChange(updated);
  };

  const removeSpecification = (index) => {
    onChange(specifications.filter((_, i) => i !== index));
  };

  const commonSpecs = [
    'Material', 'Weight', 'Dimensions', 'Color', 'Size', 
    'Brand', 'Model', 'Warranty', 'Country of Origin', 'Care Instructions'
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white"> Product Specifications</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add detailed specifications for your product</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addSpecification}
          className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border-dashed"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Spec
        </Button>
      </div>

      {specifications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">No specifications added yet</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addSpecification}
            className="mt-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Specification
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {specifications.map((spec, index) => (
            <div key={index} className="group flex gap-3 items-start bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specification Name
                  </label>
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                    placeholder="e.g., Material"
                    list={`common-specs-${index}`}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <datalist id={`common-specs-${index}`}>
                    {commonSpecs.map(spec => (
                      <option key={spec} value={spec} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    placeholder="e.g., 100% Cotton"
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="mt-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Remove specification"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Common Specs */}
      {specifications.length < 10 && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Suggested:</p>
          <div className="flex flex-wrap gap-2">
            {commonSpecs
              .filter(common => !specifications.some(spec => spec.key === common))
              .slice(0, 5)
              .map(spec => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => onChange([...specifications, { key: spec, value: '' }])}
                  className="px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors"
                >
                  + {spec}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
