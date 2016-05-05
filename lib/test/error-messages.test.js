import { errors, errorMessageGenerator } from '../error-messages'
import should from 'should'

describe('error-messages', () => {
  it('should return default message', () => {
    errorMessageGenerator(errors, 'unknown-validator', 'Name').should.eql('Name is Invalid')
  })
  it('should return message for required', () => {
    errorMessageGenerator(errors, 'required', 'Name').should.eql('Name is Required')
  })
  it('should return message for email address', () => {
    errorMessageGenerator(errors, 'email', 'Email Address').should.eql('Email Address should be a valid Email Address')
  })
  it('should return message for in', () => {
    errorMessageGenerator(errors, 'in', 'Color', ['red', 'green', 'blue']).should.eql('Color should be one of red, green, blue')
  })
  it('should return message for integer', () => {
    errorMessageGenerator(errors, 'int', 'Age').should.eql('Age should be an Number')
    errorMessageGenerator(errors, 'int', 'Age', { min: 18 }).should.eql('Age should be at least 18')
    errorMessageGenerator(errors, 'int', 'Age', { max: 65 }).should.eql('Age should be at most 65')
    errorMessageGenerator(errors, 'int', 'Age', { min: 18, max: 65 }).should.eql('Age should be between 18 and 65')
  })
  it('should return message for dates', () => {
    errorMessageGenerator(errors, 'date', 'DOB').should.eql('DOB should be a Date')
    errorMessageGenerator(errors, 'after', 'DOB').should.eql('DOB should be after Current Time')
    const dateInPast = new Date('2000/01/01')
    errorMessageGenerator(errors, 'after', 'DOB', dateInPast).should.eql(`DOB should be after ${dateInPast.toString()}`)
    errorMessageGenerator(errors, 'before', 'Anniversary').should.eql('Anniversary should be before Current Time')
    const dateInFuture = new Date('2020/01/01')
    errorMessageGenerator(errors, 'before', 'Anniversary', dateInFuture).should.eql(`Anniversary should be before ${dateInFuture.toString()}`)
  })
  it('should return message for length', () => {
    errorMessageGenerator(errors, 'length', 'Password', { min: 8 }).should.eql('Password should be a minimum of 8 characters')
    errorMessageGenerator(errors, 'length', 'Password', { min: 8, max: 12 }).should.eql('Password should be a minimum of 8 and a maximum of 12 characters')
    errorMessageGenerator(errors, 'length', 'Password').should.eql('Password is an Invalid length')
  })
  it('should return message for numeric', () => {
    errorMessageGenerator(errors, 'numeric', 'Country').should.eql('Country should only contain numbers')
  })
  it('should return message for URL', () => {
    errorMessageGenerator(errors, 'URL', 'Website').should.eql('Website should be a valid URL')
  })
})
