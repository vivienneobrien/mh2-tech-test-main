import NumberFormat from "react-number-format";
/* eslint-disable max-statements */
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { add, format } from "date-fns";
import { Button } from "./button";
import axios from 'axios';

import {
  AccountHeadline,
  AccountLabel,
  AccountSection,
  AccountList,
  InfoText,
  Inset,
  RowContainer,
} from "./style";

const subtract = (a, b) => {
  const total = a - b;
  return total;
};

const calculatePercentage = (a, b) => {
  const total = (a / b) * 100;
  return total;
};

// More functionality can be added here if a percentage was not a perfect decimal and needed to be rounded to a certain decimal place, up or down (.floor/.ceil)
const formatPercentage = (a) => {
  return (
    a + "%" 
  );
};

const divide = (a, b) => {
  const total = a / b;
  return total;
};

const formatDate = (a) => {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(a);
};

const formatAmount = (a) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(a);
}

const sincePurchased = ({ recentValuation, originalPurchasePrice }) => {
  const sincePurchasedPrice = subtract(
    recentValuation.amount,
    originalPurchasePrice
  ); // subtract (take it out of busines context), separation of concerns/calculations
  // Can also do: <NumberFormat value={sincePurchasedPrice} displayType="text" thousandSeparator={true} prefix="£" decimalScale={2} />
  const sincePurchasedPriceFormatted = formatAmount(sincePurchasedPrice)
  return sincePurchasedPriceFormatted;
};

// util.js file as plain js, pass in one date and give back a new string
// semantic: use correct attributes e.g. h1 over a span. break down html semantics the right way
//const formatDate = (a) => {


const sincePurchasedPercentage = ({
  recentValuation,
  originalPurchasePrice,
}) => {
  const sincePurchasedPrice = subtract(
    recentValuation.amount,
    originalPurchasePrice
  );
  const sincePurchasedPricePercentageCalculation = calculatePercentage(
    sincePurchasedPrice,
    originalPurchasePrice
  );
  const sincePurchasedPricePercentageFormatted = formatPercentage(
    sincePurchasedPricePercentageCalculation
  );
  return sincePurchasedPricePercentageFormatted;
};

const annualAppreciation = ({
  recentValuation,
  originalPurchasePrice,
  originalPurchasePriceDate,
}) => {
  const sincePurchasedPrice = subtract(
    recentValuation.amount,
    originalPurchasePrice
  );
  const sincePurchasedPricePercentageCalculation = calculatePercentage(
    sincePurchasedPrice,
    originalPurchasePrice
  );

  const currentYear = new Date().getFullYear();
  const numberOfYearsSincePurchased =
    currentYear - parseInt(originalPurchasePriceDate.slice(0, 4));

  const annualAppreciationCalculation = divide(
    sincePurchasedPricePercentageCalculation,
    numberOfYearsSincePurchased
  );
  const annualAppreciationFormatted = formatPercentage(
    annualAppreciationCalculation
  );
  return annualAppreciationFormatted;
};


const Detail = () => {
  const [account, setAccount] = useState({});

useEffect(() => {
  axios
    .get("/api/account")
    .then((response) => setAccount(response.data.account))
}, []);

// checking if account is empty
if (Object.keys(account).length === 0) {
  return (<div></div>)
} 

  console.log(account)

  let mortgage;
  const lastUpdate = new Date(account.lastUpdate);
  if (account.associatedMortgages.length) {
    mortgage = account.associatedMortgages[0];
  }

  const recentValuationAmountFormatted = formatAmount(account.recentValuation.amount);
  const currentBalanceFormatted = formatAmount(Math.abs(account.associatedMortgages[0].currentBalance));
  const lastUpdatedFormatted = formatDate(lastUpdate);
  console.log(lastUpdate)
  const originalPurchasePriceDateFormatted = formatDate(account.originalPurchasePriceDateFormatted)
  // const originalPruchasePriceFormatted = formatAmount(originalPurchasePrice)
  
  return (
    <Inset>
      <AccountSection>
        <AccountLabel>Estimated Value</AccountLabel>
        <AccountHeadline>
          {recentValuationAmountFormatted}
        </AccountHeadline>
        <AccountList>
          <InfoText>
            {`Last updated ${lastUpdatedFormatted}`}
          </InfoText>
          <InfoText>
            {`Next update ${format(add(lastUpdate, { days: account.updateAfterDays }),"do MMM yyyy")}`}
          </InfoText>
        </AccountList>
      </AccountSection>
      <AccountSection>
        <AccountLabel>Property details</AccountLabel>
        <RowContainer>
          <AccountList>
            <InfoText>{account.name}</InfoText>
            <InfoText>{account.bankName}</InfoText>
            <InfoText>{account.postcode}</InfoText>
          </AccountList>
        </RowContainer>
      </AccountSection>
      {mortgage && (
        <AccountSection>
          <AccountLabel>Mortgage</AccountLabel>
          <RowContainer
            // This is a dummy action
            onClick={() => alert("You have navigated to the mortgage page")}
          >
            <AccountList>
              <InfoText>
                {currentBalanceFormatted}
              </InfoText>
              <InfoText>{account.associatedMortgages[0].name}</InfoText>
            </AccountList>
          </RowContainer>
        </AccountSection>
      )}
      <AccountSection>
        <AccountLabel>Valuation Changes</AccountLabel>
        <RowContainer>
          <AccountList>
            <InfoText>
              Purchased for&nbsp;<strong>{formatAmount(account.originalPurchasePrice)}</strong>&nbsp; on the&nbsp;
            {originalPurchasePriceDateFormatted}
            </InfoText>
            <InfoText>
              Since purchase&nbsp;
              <strong>
                {sincePurchased(account)} {sincePurchasedPercentage(account)}
              </strong>
            </InfoText>
            <InfoText>
              Annual Appreciation&nbsp;
              <strong>{annualAppreciation(account)}</strong>
            </InfoText>
          </AccountList>
        </RowContainer>
      </AccountSection>
      <Button
        // This is a dummy action
        onClick={() => alert("You have navigated to the edit account page")}
      >
        Edit account
      </Button>
    </Inset>
  );
};

// Images.propTypes = {
//   url: PropTypes.string.isRequired,
// };

export default Detail;
