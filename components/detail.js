import NumberFormat from "react-number-format";
/* eslint-disable max-statements */
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { add, format } from "date-fns";
import { Button } from "./button";

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

const account = {
  uid: "65156cdc-5cfd-4b34-b626-49c83569f35e",
  deleted: false,
  dateCreated: "2020-12-03T08:55:33.421Z",
  currency: "GBP",
  name: "15 Temple Way",
  bankName: "Residential",
  type: "properties",
  subType: "residential",
  originalPurchasePrice: 250000,
  originalPurchasePriceDate: "2017-09-03",
  recentValuation: { amount: 310000, status: "good" },
  associatedMortgages: [
    {
      name: "HSBC Repayment Mortgage",
      uid: "fb463121-b51a-490d-9f19-d2ea76f05e25",
      currentBalance: -175000,
    },
  ],
  canBeManaged: false,
  postcode: "BS1 2AA",
  lastUpdate: "2020-12-01T08:55:33.421Z",
  updateAfterDays: 30,
};

const Detail = ({}) => {
  useEffect(() => {
    window
      .fetch("/api/account")
      .then((res) => res.json())
      .then(console.log);
  }, []);

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
  console.log(originalPurchasePriceDateFormatted)
  
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
              Purchased for&nbsp;<strong>£199,500</strong>&nbsp; on the&nbsp;
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

export default Detail;
