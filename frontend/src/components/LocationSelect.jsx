'use client';
import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import CustomSelect from './CustomSelect';

const allCountries = Country.getAllCountries();

const countryOptions = allCountries.map(c => ({
  value: c.name,
  label: c.name,
  isoCode: c.isoCode,
}));

export default function LocationSelect({ country, state, city, onChange }) {
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

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

  useEffect(() => {
    if (country && state) {
      const foundCountry = allCountries.find(c => c.name === country);
      if (foundCountry) {
        const states = State.getStatesOfCountry(foundCountry.isoCode);
        const foundState = states.find(s => s.name === state);
        if (foundState) {
          const cities = City.getCitiesOfState(foundCountry.isoCode, foundState.isoCode);
          setCityOptions(cities.map(c => ({ value: c.name, label: c.name })));
        } else {
          setCityOptions([]);
        }
      } else {
        setCityOptions([]);
      }
    } else {
      setCityOptions([]);
    }
  }, [country, state]);

  const handleCountryChange = (val) => onChange({ country: val, state: '', city: '' });
  const handleStateChange = (val) => onChange({ country, state: val, city: '' });

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
        {cityOptions.length > 0 ? (
          <CustomSelect
            value={city}
            onChange={(val) => onChange({ country, state, city: val })}
            options={cityOptions}
            placeholder="Select city"
            disabled={!state}
          />
        ) : (
          <input
            type="text"
            className="input"
            placeholder="e.g. Mumbai"
            value={city}
            onChange={(e) => onChange({ country, state, city: e.target.value })}
            disabled={!state}
          />
        )}
      </div>
    </div>
  );
}
