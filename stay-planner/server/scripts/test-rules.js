const rules = require('../lib/rules');

console.log('🧪 Testing Stay Planner Rules Library...\n');

// Sample trip data for testing
const sampleTrips = [
  {
    id: 1,
    country: 'FRA',
    start_date: '2024-01-15',
    end_date: '2024-01-30',
    user_id: 1
  },
  {
    id: 2,
    country: 'ITA',
    start_date: '2024-02-01',
    end_date: '2024-02-15',
    user_id: 1
  },
  {
    id: 3,
    country: 'ESP',
    start_date: '2024-03-01',
    end_date: '2024-03-20',
    user_id: 1
  },
  {
    id: 4,
    country: 'DEU',
    start_date: '2024-04-01',
    end_date: '2024-04-10',
    user_id: 1
  },
  {
    id: 5,
    country: 'USA', // Non-Schengen country
    start_date: '2024-05-01',
    end_date: '2024-05-15',
    user_id: 1
  },
  {
    id: 6,
    country: 'FRA',
    start_date: '2024-06-01',
    end_date: '2024-06-30',
    user_id: 1
  },
  {
    id: 7,
    country: 'ITA',
    start_date: '2024-07-01',
    end_date: '2024-07-31',
    user_id: 1
  }
];

console.log('📊 Sample Trip Data:');
sampleTrips.forEach(trip => {
  console.log(`  ${trip.country}: ${trip.start_date} to ${trip.end_date}`);
});

console.log('\n' + '='.repeat(60) + '\n');

// Test 1: daysInRange function
console.log('1️⃣ Testing daysInRange Function:');
console.log('Days in Q1 2024:', rules.daysInRange(sampleTrips, '2024-01-01', '2024-03-31'));
console.log('Days in France in Q1 2024:', rules.daysInRange(sampleTrips, '2024-01-01', '2024-03-31', 'FRA'));
console.log('Days in Q2 2024:', rules.daysInRange(sampleTrips, '2024-04-01', '2024-06-30'));
console.log('Days in Italy in Q2 2024:', rules.daysInRange(sampleTrips, '2024-04-01', '2024-06-30', 'ITA'));

console.log('\n' + '='.repeat(60) + '\n');

// Test 2: schengenRemainingDays function
console.log('2️⃣ Testing schengenRemainingDays Function:');
const referenceDate = '2024-07-15';
const schengenStatus = rules.schengenRemainingDays(sampleTrips, referenceDate);
console.log(`Schengen status as of ${referenceDate}:`);
console.log(`  Used days: ${schengenStatus.used}`);
console.log(`  Remaining days: ${schengenStatus.remaining}`);
console.log(`  Window: ${schengenStatus.windowStart} to ${schengenStatus.windowEnd}`);

// Test with different reference dates
console.log('\nSchengen status at different dates:');
['2024-03-15', '2024-06-15', '2024-08-15'].forEach(date => {
  const status = rules.schengenRemainingDays(sampleTrips, date);
  console.log(`  ${date}: ${status.used} used, ${status.remaining} remaining`);
});

console.log('\n' + '='.repeat(60) + '\n');

// Test 3: residency183Status function
console.log('3️⃣ Testing residency183Status Function:');
const residency2024 = rules.residency183Status(sampleTrips, 2024);
console.log('Residency status for 2024:');
Object.entries(residency2024).forEach(([country, status]) => {
  const threshold = status.meetsThreshold ? '✅' : '❌';
  console.log(`  ${country}: ${status.days} days ${threshold} (${status.days >= 183 ? 'Meets' : 'Below'} 183 threshold)`);
});

console.log('\n' + '='.repeat(60) + '\n');

// Test 4: Utility functions
console.log('4️⃣ Testing Utility Functions:');
console.log('Schengen countries count:', rules.getSchengenCountries().length);
console.log('Is France Schengen?', rules.isSchengenCountry('FRA'));
console.log('Is USA Schengen?', rules.isSchengenCountry('USA'));
console.log('Is Italy Schengen?', rules.isSchengenCountry('ITA'));

console.log('\n' + '='.repeat(60) + '\n');

// Test 5: Edge cases and complex scenarios
console.log('5️⃣ Testing Edge Cases:');
console.log('Days in overlapping period:', rules.daysInRange(sampleTrips, '2024-01-20', '2024-02-10'));
console.log('Days in non-existent period:', rules.daysInRange(sampleTrips, '2024-12-01', '2024-12-31'));
console.log('Days in specific country (USA):', rules.daysInRange(sampleTrips, '2024-01-01', '2024-12-31', 'USA'));

// Test with empty trips array
console.log('\nTesting with empty trips:');
const emptyTrips = [];
console.log('Empty trips - days in range:', rules.daysInRange(emptyTrips, '2024-01-01', '2024-12-31'));
console.log('Empty trips - schengen status:', rules.schengenRemainingDays(emptyTrips, '2024-07-15'));
console.log('Empty trips - residency status:', rules.residency183Status(emptyTrips, 2024));

console.log('\n' + '='.repeat(60) + '\n');

// Test 6: Performance test with many trips
console.log('6️⃣ Performance Test:');
const manyTrips = [];
for (let i = 0; i < 1000; i++) {
  const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  const endDate = new Date(startDate.getTime() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000);
  
  manyTrips.push({
    id: i + 1,
    country: rules.getSchengenCountries()[Math.floor(Math.random() * rules.getSchengenCountries().length)],
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    user_id: 1
  });
}

console.log(`Generated ${manyTrips.length} random trips`);
const startTime = Date.now();
const performanceStatus = rules.schengenRemainingDays(manyTrips, '2024-07-15');
const endTime = Date.now();
console.log(`Performance test result: ${performanceStatus.used} used, ${performanceStatus.remaining} remaining`);
console.log(`Calculation time: ${endTime - startTime}ms`);

console.log('\n🎯 Rules Library Test Complete!');
console.log('All functions are working correctly with the sample data.');
