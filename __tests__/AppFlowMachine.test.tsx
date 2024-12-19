/**
 * @format
 */

import 'react-native';

import {afterEach, describe, expect, it} from '@jest/globals';

import AppFlowEvents from '../src/Machines/AppFlow/AppFlowEvents';
import { AppFlowMachine } from '../src/Machines/AppFlow/AppFlowMachine';
import AppFlowStates from '../src/Machines/AppFlow/AppFlowStates';
import {interpret} from 'xstate';

// Note: import explicitly to use the types shiped with jest.







describe('AppFlowMachine', () => {
  let service = interpret(AppFlowMachine);

  afterEach(() => {
    service.stop();
  });

  it('should start with the Init state', () => {
    service.start();
    expect(service.state.value).toEqual(AppFlowStates.Init);
  });

  it('should transition to PurchaseInvitation on SUCCESS', () => {
    service.start();
    service.send(AppFlowEvents.SUCCESS);
    expect(service.state.value).toEqual(AppFlowStates.PurchaseInvitation);
  });

  it('should transition to NotReady on ERROR', () => {
    service.start();
    service.send(AppFlowEvents.ERROR);
    expect(service.state.value).toEqual(AppFlowStates.NotReady);
  });

  it('should transition to Init from NotReady on REPEAT', () => {
    service.start(AppFlowStates.NotReady);
    service.send(AppFlowEvents.REPEAT);
    expect(service.state.value).toEqual(AppFlowStates.Init);
  });

  it('should transition to PurchaseInit from PurchaseInvitation on START_PURCHASE', () => {
    service.start(AppFlowStates.PurchaseInvitation);
    service.send(AppFlowEvents.START_PURCHASE);
    expect(service.state.value).toEqual(AppFlowStates.PurchaseInit);
  });

  it('should transition to PurchaseInvitation from PurchaseInit on ERROR', () => {
    service.start(AppFlowStates.PurchaseInit);
    service.send(AppFlowEvents.ERROR);
    expect(service.state.value).toEqual(AppFlowStates.PurchaseInvitation);
  });

  it('should transition to PurchaseInvitation from PurchaseInit on CANCEL', () => {
    service.start(AppFlowStates.PurchaseInit);
    service.send(AppFlowEvents.CANCEL);
    expect(service.state.value).toEqual(AppFlowStates.PurchaseInvitation);
  });
  
  it('should transition to BasketFormation from PurchaseInit on SUCCESS', () => {
    service.start(AppFlowStates.PurchaseInit);
    service.send(AppFlowEvents.SUCCESS);
    expect(service.state.value).toEqual(AppFlowStates.BasketFormation);
  });
    
  it('should transition to Payment from BasketFormation on START_PAYMENT', () => {
    service.start(AppFlowStates.BasketFormation);
    service.send(AppFlowEvents.START_PAYMENT);
    expect(service.state.value).toEqual(AppFlowStates.Payment);
  });

  it('should transition to PurchaseCancel from BasketFormation on CANCEL', () => {
    service.start(AppFlowStates.BasketFormation);
    service.send(AppFlowEvents.CANCEL);
    expect(service.state.value).toEqual(AppFlowStates.PurchaseCancel);
  });

  it('should transition to PurchaseSuccess from Payment on SUCCESS', () => {
    service.start(AppFlowStates.Payment);
    service.send(AppFlowEvents.SUCCESS);
    expect(service.state.value).toEqual(AppFlowStates.PurchaseSuccess);
  });

  it('should transition to PurchaseCancel from Payment on CANCEL', () => {
    service.start(AppFlowStates.Payment);
    service.send(AppFlowEvents.CANCEL);
    expect(service.state.value).toEqual(AppFlowStates.PurchaseCancel);
  });

  it('should transition to PurchaseInvitation from PurchaseSuccess on RETURN', () => {
    service.start(AppFlowStates.PurchaseSuccess);
    service.send(AppFlowEvents.RETURN);
    expect(service.state.value).toEqual(AppFlowStates.PurchaseInvitation);
  });

  it('should transition to PurchaseInvitation from PurchaseCancel on SUCCESS', () => {
    service.start(AppFlowStates.PurchaseCancel);
    service.send(AppFlowEvents.SUCCESS);
    expect(service.state.value).toEqual(AppFlowStates.PurchaseInvitation);
  });
});