---
title: SVM Parameters
description: Parameter description for Simple Vector Machine ML algorithm
tags: ['machine learning']
timestamp: 1542939081000
---

## SVM Parameters

C parameter:
* determines how intricate decision boundaries are.
* The Larger the number, the more intricate it is, thereby increasing the risk of ‘overfitting’ to training data
* The Smaller the number, the better it is in generalizing to test sets

Gamma parameter:
* determines how far the influence of a single training data reaches.
* With a Larger number, the training data close to decision boundary would hold more weight, thereby ignoring far-away data points in constructing decision boundary. (risk of ‘overfitting’)
* With a Smaller number, far-away data points would be considered in the construction of decision boundary. (better at generalizing to test sets)
