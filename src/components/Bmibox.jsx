import React, { useState } from 'react'

const categoryDetails = {
  Underweight: {
    color: '#ffb703',
    advice: 'Try adding more nutrient-dense meals and strength-building foods to support healthy weight gain.'
  },
  'Healthy weight': {
    color: '#22c55e',
    advice: 'You are in a healthy range. Keep up balanced meals, movement, and consistent sleep habits.'
  },
  Overweight: {
    color: '#fb923c',
    advice: 'Small, steady changes in food habits and daily activity can make a noticeable difference.'
  },
  'Obesity Class I': {
    color: '#f97316',
    advice: 'A practical plan with regular movement, portion awareness, and medical guidance can help.'
  },
  'Obesity Class II': {
    color: '#ef4444',
    advice: 'It may help to work with a professional to build a clear and sustainable health plan.'
  },
  'Obesity Class III': {
    color: '#b91c1c',
    advice: 'Prioritizing consistent habits and medical support is important for long-term health improvement.'
  }
}

const getBmiCategory = (bmi) => {
  if (bmi < 18.5) {
    return 'Underweight'
  }

  if (bmi < 25) {
    return 'Healthy weight'
  }

  if (bmi < 30) {
    return 'Overweight'
  }

  if (bmi < 35) {
    return 'Obesity Class I'
  }

  if (bmi < 40) {
    return 'Obesity Class II'
  }

  return 'Obesity Class III'
}

const getHealthyWeightRange = (heightValue, unit) => {
  if (unit === 'metric') {
    const heightInMeters = heightValue / 100
    const minWeight = 18.5 * heightInMeters * heightInMeters
    const maxWeight = 24.9 * heightInMeters * heightInMeters

    return {
      min: minWeight,
      max: maxWeight,
      unitLabel: 'kg'
    }
  }

  const heightInInches = heightValue
  const minWeight = (18.5 * heightInInches * heightInInches) / 703
  const maxWeight = (24.9 * heightInInches * heightInInches) / 703

  return {
    min: minWeight,
    max: maxWeight,
    unitLabel: 'lb'
  }
}

const getGoalAdvice = (goal, category) => {
  const adviceMap = {
    maintain: {
      Underweight: 'Aim for steady meals and consistent strength training to support healthy weight restoration.',
      'Healthy weight': 'Keep your current routine and focus on balanced nutrition and regular movement.',
      Overweight: 'Focus on realistic portion control and daily activity to stay consistent.',
      'Obesity Class I': 'Build consistent habits around exercise and eating patterns rather than quick fixes.',
      'Obesity Class II': 'A gradual plan with strength and cardio work can produce sustainable results.',
      'Obesity Class III': 'A structured, long-term plan with professional guidance can improve health outcomes.'
    },
    lose: {
      Underweight: 'A weight-gain plan is better for your goal, so focus on protein, healthy fats, and strength training.',
      'Healthy weight': 'Stay in a moderate calorie deficit and maintain your progress with balanced meals.',
      Overweight: 'A gradual calorie deficit and regular movement are ideal for safe, sustainable weight loss.',
      'Obesity Class I': 'Try simple daily routines like walking, meal planning, and reducing liquid calories.',
      'Obesity Class II': 'Consistency is key and a slower approach often works better for long-term success.',
      'Obesity Class III': 'Talk to a healthcare professional to build a safe plan around sustainable habits.'
    },
    gain: {
      Underweight: 'Focus on calorie-dense foods, regular meals, and strength-based training.',
      'Healthy weight': 'A small calorie surplus with strength training can help build lean mass without excess fat.',
      Overweight: 'For your goal, a professional assessment is better before trying to gain weight intentionally.',
      'Obesity Class I': 'Weight gain is not recommended at this stage; focus on improving fitness and body composition.',
      'Obesity Class II': 'Your current goal would be better adjusted with medical guidance before weight gain.',
      'Obesity Class III': 'A clinician-guided plan is important before trying to increase body weight.'
    }
  }

  return adviceMap[goal]?.[category] || 'Keep your habits realistic and sustainable.'
}

const getCalorieTarget = (weight, unit, goal) => {
  const weightInKg = unit === 'metric' ? Number(weight) : Number(weight) * 0.453592
  const factorMap = {
    maintain: 1,
    lose: 0.8,
    gain: 1.2
  }

  const target = weightInKg * 30 * factorMap[goal]
  return Math.round(target)
}

const Bmibox = () => {
  const [unit, setUnit] = useState('metric')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [goal, setGoal] = useState('maintain')
  const [bmi, setBmi] = useState(null)
  const [message, setMessage] = useState('')
  const [healthyRange, setHealthyRange] = useState(null)
  const [healthAdvice, setHealthAdvice] = useState('')
  const [calorieTarget, setCalorieTarget] = useState(null)

  const handleCalculate = (event) => {
    event.preventDefault()

    const parsedWeight = Number(weight)
    const parsedHeight = Number(height)
    const parsedAge = Number(age)

    if (!weight || !height || !age || parsedWeight <= 0 || parsedHeight <= 0 || parsedAge <= 0) {
      setBmi(null)
      setMessage('Please enter valid values for age, weight, and height.')
      setHealthyRange(null)
      setHealthAdvice('')
      setCalorieTarget(null)
      return
    }

    let calculatedBmi = 0

    if (unit === 'metric') {
      const heightInMeters = parsedHeight / 100
      calculatedBmi = parsedWeight / (heightInMeters * heightInMeters)
    } else {
      calculatedBmi = (703 * parsedWeight) / (parsedHeight * parsedHeight)
    }

    const category = getBmiCategory(calculatedBmi)
    const range = getHealthyWeightRange(parsedHeight, unit)
    const target = getCalorieTarget(parsedWeight, unit, goal)
    const advice = getGoalAdvice(goal, category)

    setBmi(calculatedBmi)
    setHealthyRange(range)
    setHealthAdvice(advice)
    setCalorieTarget(target)
    setMessage(`Your BMI falls in the ${category.toLowerCase()} range.`)
  }

  const handleReset = () => {
    setUnit('metric')
    setWeight('')
    setHeight('')
    setAge('')
    setGoal('maintain')
    setBmi(null)
    setMessage('')
    setHealthyRange(null)
    setHealthAdvice('')
    setCalorieTarget(null)
  }

  const bmiPercent = (() => {
    if (bmi === null) return 0
    const raw = ((bmi - 15) / 25) * 100
    return Math.min(Math.max(raw, 5), 100)
  })()

  return (
    <main className="maincontainer">
      <div className="bmicontainer">
        <div className="bmi-card">
          <p className="eyebrow">Health tracker</p>
          <h2>BMI Calculator</h2>

          <form onSubmit={handleCalculate}>
            <div className="unit-toggle" aria-label="Unit toggle">
              <button
                type="button"
                className={unit === 'metric' ? 'toggle-option active' : 'toggle-option'}
                onClick={() => setUnit('metric')}
              >
                Metric
              </button>
              <button
                type="button"
                className={unit === 'imperial' ? 'toggle-option active' : 'toggle-option'}
                onClick={() => setUnit('imperial')}
              >
                Imperial
              </button>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="weight">Weight</label>
                <input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder={unit === 'metric' ? 'kg' : 'lb'}
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="height">Height</label>
                <input
                  id="height"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder={unit === 'metric' ? 'cm' : 'in'}
                  value={height}
                  onChange={(event) => setHeight(event.target.value)}
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Age"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="goal">Goal</label>
                <select id="goal" value={goal} onChange={(event) => setGoal(event.target.value)}>
                  <option value="maintain">Maintain</option>
                  <option value="lose">Lose weight</option>
                  <option value="gain">Gain weight</option>
                </select>
              </div>
            </div>

            <div className="button-row">
              <button type="submit" className="primary-btn">Calculate BMI</button>
              <button type="button" className="secondary-btn" onClick={handleReset}>Reset</button>
            </div>
          </form>

          {message && (
            <p className={`message ${bmi === null ? 'error' : 'success'}`}>
              {message}
            </p>
          )}

          {bmi !== null && (
            <>
              <div className="result-box">
                <div className="result-label">Your BMI</div>
                <div className="result-value">{bmi.toFixed(1)}</div>
                <div className="result-category" style={{ color: categoryDetails[getBmiCategory(bmi)].color }}>
                  {getBmiCategory(bmi)}
                </div>
              </div>

              <div className="bmi-meter">
                <div className="bmi-meter__labels">
                  <span>15</span>
                  <span>25</span>
                  <span>40</span>
                </div>
                <div className="bmi-meter__track">
                  <div className="bmi-meter__fill" style={{ width: `${bmiPercent}%`, background: categoryDetails[getBmiCategory(bmi)].color }} />
                </div>
              </div>

              <div className="health-grid">
                <div className="info-card">
                  <span className="info-label">Healthy range</span>
                  <strong>
                    {healthyRange ? `${healthyRange.min.toFixed(1)} - ${healthyRange.max.toFixed(1)} ${healthyRange.unitLabel}` : '—'}
                  </strong>
                </div>

                <div className="info-card">
                  <span className="info-label">Daily goal</span>
                  <strong>{calorieTarget ? `${calorieTarget} kcal` : '—'}</strong>
                </div>
              </div>

              <div className="tip-box">
                <h3>Health tip</h3>
                <p>{healthAdvice}</p>
              </div>

              <div className="category-list">
                {Object.entries(categoryDetails).map(([label, details]) => (
                  <div key={label} className={`category-item ${getBmiCategory(bmi) === label ? 'active' : ''}`}>
                    <span className="dot" style={{ backgroundColor: details.color }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default Bmibox