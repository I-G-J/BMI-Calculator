import React, { useState } from 'react'

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

const Bmibox = () => {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmi, setBmi] = useState(null)
  const [message, setMessage] = useState('')

  const handleCalculate = (event) => {
    event.preventDefault()

    const parsedWeight = Number(weight)
    const parsedHeight = Number(height)

    if (!weight || !height || parsedWeight <= 0 || parsedHeight <= 0) {
      setBmi(null)
      setMessage('Please enter valid values for weight and height.')
      return
    }

    const heightInMeters = parsedHeight / 100
    const calculatedBmi = parsedWeight / (heightInMeters * heightInMeters)
    const category = getBmiCategory(calculatedBmi)

    setBmi(calculatedBmi)
    setMessage(`Your BMI is ${category.toLowerCase()}.`)
  }

  const handleReset = () => {
    setWeight('')
    setHeight('')
    setBmi(null)
    setMessage('')
  }

  return (
    <main className="maincontainer">
      <div className="bmicontainer">
        <div className="bmi-card">
          <p className="eyebrow">Health tracker</p>
          <h2>BMI Calculator</h2>

          <form onSubmit={handleCalculate}>
            <div className="input-group">
              <label htmlFor="weight">Your Weight in (kg):</label>
              <input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                placeholder="Enter your weight"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="height">Your Height in (cm):</label>
              <input
                id="height"
                type="number"
                min="0"
                step="0.1"
                placeholder="Enter your height"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
              />
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
            <div className="result-box">
              <div className="result-label">Your BMI</div>
              <div className="result-value">{bmi.toFixed(1)}</div>
              <div className="result-category">{getBmiCategory(bmi)}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Bmibox