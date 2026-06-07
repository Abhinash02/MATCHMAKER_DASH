'use client';
import { useState, useEffect } from 'react';
import { Country, State } from 'country-state-city';
import CustomSelect from './CustomSelect';

const allCountries = Country.getAllCountries();

const countryOptions = allCountries.map(c => ({
  value: c.name,
  label: c.name,
  isoCode: c.isoCode,
}));

export default function LocationSelect({ country, state, city, onChange }) {
  const [stateOptions, setStateOptions] = useState([]);

  useEffect(() => {
    if (country) {
      const found = allCountries.find(c => c.name === country);
      if (found) {
        const states = State.getStatesOfCountry(found.isoCode);
        setStateOptions(states.map(s => ({ value: s.name, label: s.name, icon: null })));
      } else {
        setStateOptions([]);
      }
    } else {
      setStateOptions([]);
    }
  }, [country]);

  const handleCountryChange = (val) => onChange({ country: val, state: '', city });
  const handleStateChange = (val) => onChange({ country, state: val, city });
  const handleCityChange = (e) => onChange({ country, state, city: e.target.value });

  return (
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Country */}
      <div>
        <label className="label">Country</label>
        <CustomSelect
          value={country}
          onChange={handleCountryChange}
          options={countryOptions}
          placeholder="Select country"
        />
      </div>

      {/* State */}
      <div>
        <label className="label">State / Province</label>
        <CustomSelect
          value={state}
          onChange={handleStateChange}
          options={stateOptions}
          placeholder={!country ? 'Select country first' : stateOptions.length === 0 ? 'No states' : 'Select state'}
          disabled={!country || stateOptions.length === 0}
        />
      </div>

      {/* City */}
      <div>
        <label className="label">City</label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Mumbai"
          value={city}
          onChange={handleCityChange}
          disabled={!country}
        />
      </div>
    </div>
  );
}
