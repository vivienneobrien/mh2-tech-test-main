import NumberFormat from "react-number-format";
/* eslint-disable max-statements */
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { add, format } from "date-fns";
import { Button } from "./button";
import axios from "axios";

import {
  AccountHeadline,
  AccountLabel,
  AccountSection,
  AccountList,
  InfoText,
  Inset,
  RowContainer,
} from "./style";

const subtract = (numOne, numTwo) => {
  const total = numOne - numTwo;
  return total;
};

const calculatePercentage = (numOne, numTwo) => {
  const total = (numOne / numTwo) * 100;
  return total;
};

const divide = (numOne, numTwo) => {
  const total = numOne / numTwo;
  return total;
};

// More functionality can be added here if a percentage was not a perfect decimal and needed to be rounded to a certain decimal place, up or down (.floor/.ceil)
const formatPercentage = (num) => {
  return num + "%";
};

const formatDate = (stringDateObject) => {
  if (!(stringDateObject instanceof Date)) {
    // Confirms it is a string date object
    stringDateObject = new Date(stringDateObject);
  }
  return format(stringDateObject, "do MMM yyyy");
};

const formatAmount = (num) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const sincePurchased = ({ recentValuation, originalPurchasePrice }) => {
  const sincePurchasedPrice = subtract(
    recentValuation.amount,
    originalPurchasePrice
  );
  // Can also do: <NumberFormat value={sincePurchasedPrice} displayType="text" thousandSeparator={true} prefix="£" decimalScale={2} />
  const sincePurchasedPriceFormatted = formatAmount(sincePurchasedPrice);
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
  const numberOfYearsSincePurchased = subtract(
    currentYear,
    parseInt(originalPurchasePriceDate.slice(0, 4))
  );
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
      .then((response) => setAccount(response.data.account));
  }, []);

  const [accountIsLoading, setAccountIsLoading] = useState(false);

  useEffect(() => {
    setAccountIsLoading(true);
    axios
      .get("/api/account")
      .then(
        (response) => { setAccount(response.data.account)
        setAccountIsLoading(false)
        }
      )
      .catch(
        (err) => {console.log(err)
        setAccountIsLoading(false)
        }
      );
  }, []);

  // checking if account is empty
  // if (Object.keys(account).length === 0) {
  //   return <div>No account provided</div>;
  // }

  if (accountIsLoading) {
    return ( {accountIsLoading} &&
      <div>Loading Account...</div>
    );
  }

  let mortgage;
  const lastUpdate = new Date(account.lastUpdate);
  if (account.associatedMortgages.length) {
    mortgage = account.associatedMortgages[0];
  }

  const recentValuationAmountFormatted = formatAmount(
    account.recentValuation.amount
  );
  const currentBalanceFormatted = formatAmount(
    Math.abs(account.associatedMortgages[0].currentBalance)
  );
  const lastUpdatedFormatted = formatDate(lastUpdate);
  const originalPurchasePriceDateFormatted = formatDate(
    account.originalPurchasePriceDate
  );
  const originalPruchasePriceFormatted = formatAmount(
    account.originalPurchasePrice
  );
  const sincePurchasedAccount = sincePurchased(account);
  const sincePurchasedAccountPercentage = sincePurchasedPercentage(account);
  const annualAppreciationAccount = annualAppreciation(account);

  return (
    <Inset>
      <AccountSection>
        <AccountLabel>Estimated Value</AccountLabel>
        <AccountHeadline>{recentValuationAmountFormatted}</AccountHeadline>
        <AccountList>
          <InfoText>{`Last updated ${lastUpdatedFormatted}`}</InfoText>
          <InfoText>
            {`Next update ${formatDate(
              add(lastUpdate, { days: account.updateAfterDays })
            )}`}
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
              <InfoText>{currentBalanceFormatted}</InfoText>
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
              Purchased for&nbsp;
              <strong>{originalPruchasePriceFormatted}</strong>
              &nbsp;on&nbsp;the&nbsp;
              {originalPurchasePriceDateFormatted}
            </InfoText>
            <InfoText>
              Since purchase&nbsp;
              <strong>
                {sincePurchasedAccount} {sincePurchasedAccountPercentage}
              </strong>
            </InfoText>
            <InfoText>
              Annual Appreciation&nbsp;
              <strong>{annualAppreciationAccount}</strong>
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
