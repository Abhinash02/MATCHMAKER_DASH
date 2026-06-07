function scoreMatch(client, candidate) {
  let score = 0;
  const reasons = [];

  const clientAge = getAge(client.dateOfBirth);
  const candidateAge = getAge(candidate.dateOfBirth);

  if (client.gender === 'male') {
    if (clientAge && candidateAge) {
      const diff = clientAge - candidateAge;
      if (diff >= 1 && diff <= 5) { score += 20; reasons.push('Ideal age gap (1-5 yrs younger)'); }
      else if (diff > 5 && diff <= 10) { score += 10; reasons.push('Acceptable age gap'); }
      else if (diff === 0) { score += 8; reasons.push('Same age'); }
    }
    if (candidate.income && client.income && candidate.income < client.income) {
      score += 20; reasons.push('Income compatibility');
    }
    if (candidate.income > 0) { score += 5; reasons.push('Financially independent'); }
    if (candidate.height && client.height && candidate.height < client.height) {
      score += 15; reasons.push('Height compatible');
    }
  } else {
    if (clientAge && candidateAge) {
      const diff = candidateAge - clientAge;
      if (diff >= 1 && diff <= 5) { score += 15; reasons.push('Ideal age gap'); }
      else if (diff > 5 && diff <= 10) { score += 8; reasons.push('Acceptable age gap'); }
    }
    const edu = { premium: 3, good: 2, average: 1 };
    if ((edu[candidate.educationTier] || 1) >= (edu[client.educationTier] || 1)) {
      score += 20; reasons.push('Education compatibility');
    }
    if (candidate.income && client.income && candidate.income >= client.income) {
      score += 10; reasons.push('Financial stability');
    }
    if (client.openToRelocate === 'yes' || candidate.openToRelocate === 'yes') {
      score += 15; reasons.push('Relocation flexibility');
    }
    if (client.familyType === candidate.familyType) {
      score += 15; reasons.push('Family values aligned');
    }
  }

  if (client.wantKids === candidate.wantKids) { score += 15; reasons.push('Aligned on children'); }
  else if (client.wantKids === 'maybe' || candidate.wantKids === 'maybe') { score += 5; }

  if (client.religion && candidate.religion && client.religion === candidate.religion) {
    score += 10; reasons.push('Same religion');
  }
  if (client.diet === candidate.diet) { score += 5; reasons.push('Dietary compatibility'); }
  if (client.smoking === candidate.smoking) score += 3;
  if (client.drinking === candidate.drinking) score += 2;
  if (client.caste && candidate.caste && client.caste === candidate.caste) {
    score += 5; reasons.push('Same community');
  }

  const capped = Math.min(score, 100);
  let label = 'Low Match';
  if (capped >= 85) label = 'Exceptional Match';
  else if (capped >= 70) label = 'High Potential';
  else if (capped >= 55) label = 'Good Match';
  else if (capped >= 40) label = 'Possible Match';

  return { score: capped, label, reasons };
}

function getAge(dob) {
  if (!dob) return null;
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

module.exports = { scoreMatch };
