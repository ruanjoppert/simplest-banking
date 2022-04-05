Feature: Deposit

Scenario: Deposit fund into a new account
  When I deposit 10 $ebx in account 100
  And I make a new deposit of 20 $ebx in account 100, totaling 30 $ebx
  Then Account 100 must have 30 $ebx
