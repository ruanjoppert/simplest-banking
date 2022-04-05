Feature: Withdraw

Scenario: Withdraw fund from non-existing account
  When I request a withdrawal of 10 $ebx from account 200
  Then I should get a warning that the account doesn't exist

Scenario: Withdraw from existing account
  When I request a withdrawal of 10 $ebx from account 100
  Then Account 100 should have 20 $ebx

Scenario: Withdraw when amount greater than the balance
  When I request a withdrawal of 100 $ebx from account 100
  Then I must be warned that the withdrawal was not made

