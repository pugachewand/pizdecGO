import {assign, createMachine} from 'xstate';

import AppFlowEvents from './AppFlowEvents';
import AppFlowStates from './AppFlowStates';
import { ICheckItemRequisitesEntity } from '../../BackendEntities/Cart/ProductEntity';
import { IPurchaseInitiationResponse } from 'BackendEntities/Cart/PurchaseRepoEntity';
import { PurchaseContextInitial } from './AppFlowContext';
import {createContext} from 'react';

type uniqueItemsType = {
  [key: number]: number;
}
interface iziGoContext {
  PurchaseContext: {
    init: IPurchaseInitiationResponse,
    items: ICheckItemRequisitesEntity[],
  }
}
// TODO: При отсутствующем соеденении с бэком не пропускать дальше инита

export const AppFlowMachine = createMachine({
  id: 'appFlowMachine',
  initial: AppFlowStates.EngineeringMenu,
  predictableActionArguments: true,
  schema: {
    context: {} as iziGoContext
  },
  context: {
    PurchaseContext: PurchaseContextInitial
  },
  states: {
    [AppFlowStates.EngineeringMenu]: {
      on: {
        [AppFlowEvents.SUCCESS]: AppFlowStates.UsbDevicesCheck,
        [AppFlowEvents.ERROR]: AppFlowStates.NotReady,
      },
    },
    [AppFlowStates.UsbDevicesCheck]: {
      on: {
        [AppFlowEvents.SUCCESS]: AppFlowStates.Init,
        [AppFlowEvents.ERROR]: AppFlowStates.NotReady,
        [AppFlowEvents.RETURN]: AppFlowStates.EngineeringMenu,
      },
    },
    [AppFlowStates.Init]: {
      on: {
        [AppFlowEvents.SUCCESS]: AppFlowStates.PurchaseInvitation,
        [AppFlowEvents.ERROR]: AppFlowStates.NotReady,
      },
    },

    [AppFlowStates.NotReady]: {
      on: {
        // TODO: Когда будем выпиливать MobX и допиливать Xstate нужно будет сделать history
        // по которому можно будет навигироваться вперед и назад
        [AppFlowEvents.REPEAT]: AppFlowStates.Init,
        [AppFlowEvents.RETURN]: AppFlowStates.UsbDevicesCheck,
        [AppFlowEvents.RETURN_TO_ENGINEERING_MENU]: AppFlowStates.EngineeringMenu,
        [AppFlowEvents.PURCHASE_INVITATION]: AppFlowStates.PurchaseInvitation
      },
    },

    [AppFlowStates.PurchaseInvitation]: {
      on: {
        [AppFlowEvents.START_PURCHASE]: AppFlowStates.PurchaseInit,
        [AppFlowEvents.START_PAYMENT_RECONCILIATION]: AppFlowStates.PaymentReconciliation,
      },
    },

    [AppFlowStates.PurchaseInit]: {
      on: {
        [AppFlowEvents.SUCCESS]: {target: AppFlowStates.BasketFormation, actions: 'initiatePurchase'},
        [AppFlowEvents.ERROR]: AppFlowStates.PurchaseInvitation,
        [AppFlowEvents.CANCEL]: AppFlowStates.PurchaseInvitation,
      },
    },

    [AppFlowStates.BasketFormation]: {
      on: {
        [AppFlowEvents.START_PAYMENT]: AppFlowStates.Payment,
        [AppFlowEvents.REMOVE_PRODUCT]: {actions: 'removeProduct'},
        [AppFlowEvents.REMOVE_PRODUCTS]: {actions: 'removeProducts'},
        [AppFlowEvents.ADD_PRODUCT]: {actions: 'addProduct'},
        [AppFlowEvents.CANCEL]: {target: AppFlowStates.PurchaseInvitation, actions: 'cancelPurchase'},
        [AppFlowEvents.UPDATE_BASKET_PRODUCT_ITEMS]: {actions: 'updateCartProductItems'},
        [AppFlowEvents.ERROR]: AppFlowStates.NotReady,
        [AppFlowEvents.PURCHASE_INVITATION]: AppFlowStates.PurchaseInvitation
      },
    },

    [AppFlowStates.Payment]: {
      on: {
        [AppFlowEvents.SUCCESS]: {target: AppFlowStates.PurchaseSuccess, actions: 'cancelPurchase'},
        [AppFlowEvents.ERROR]: AppFlowStates.NotReady,
        [AppFlowEvents.CANCEL]: AppFlowStates.BasketFormation,
        [AppFlowEvents.PURCHASE_INVITATION]: AppFlowStates.PurchaseInvitation
      },
    },

    [AppFlowStates.PurchaseSuccess]: {
      on: {
        [AppFlowEvents.RETURN]: AppFlowStates.PurchaseInvitation,
      },
    },

    [AppFlowStates.PaymentReconciliation]: {
      on: {
        [AppFlowEvents.SUCCESS]: AppFlowStates.PurchaseInvitation
      }
    },
    [AppFlowStates.Support]: {
      on: {
        [AppFlowEvents.PURCHASE_INVITATION]: AppFlowStates.PurchaseInvitation
      }
    }
  },
},
{
  // TODO: Декомпозировать в отдельный файл
  actions: {
    // @ts-ignore
    removeProduct: assign((context, event) => {
      // @ts-ignore
      const payload = event.event as ICheckItemRequisitesEntity
      console.log('PAAAAAAAAAAAAAAAAAYLOAD:::', payload)
      const filteredItems = context.PurchaseContext.items.filter(x => x.labeledGoodId !== payload.labeledGoodId)
      context.PurchaseContext.items = filteredItems
    }),
    // @ts-ignore
    removeProducts: assign((context, event) => {
    // @ts-ignore
      const payload = event.event as ICheckItemRequisitesEntity
      console.log('PAAAAAAAAAAAAAAAAAYLOAD:::', payload)
      const filteredItems = context.PurchaseContext.items.filter(x => x.labelForBackend !== payload.labelForBackend)
      console.log('filteredItems:::', filteredItems)
      context.PurchaseContext.items = filteredItems
    }),
    // @ts-ignore
    addProduct: assign((context, event) => {
    // @ts-ignore
      const payload = event.event as ICheckItemRequisitesEntity
      console.log('PAYLOAD IN ADD PRODUCT:::', payload)
      const newItems = [...context.PurchaseContext.items, payload]
      const used: uniqueItemsType = {};
        const uniqueItems = newItems.filter(function (obj) {
          return obj.labeledGoodId in used ? 0 : (used[obj.labeledGoodId] = 1);
      });
      context.PurchaseContext.items = uniqueItems
    }),
    // @ts-ignore
    initiatePurchase: assign((context, event) => {
      // @ts-ignore
      const payload = event.event as IPurchaseInitiationResponse
      // @ts-ignore
      const items = event.event.items ? (event.event.items).flat() : []
      console.log('PAAAAAAAAYLOAD IN INIT ITEMS:::', items)
      context.PurchaseContext.init = payload
      context.PurchaseContext.items = items
    }),
    // @ts-ignore
    cancelPurchase: assign((context, event) => {
      // По какой то причине PurchaseContextInitial перезаписывается из начального состояния где все 0 / null в состояние с данными из инициализации витрины, пока оставлю так...
      const PurchaseContextInitialTest = {
        init: {
          posOperationId:0,
          status: null,
          brandAccountId:0,
          posId:0,
          settings:"",
          usingFiscalization:false,
          paymentMethodTypes: [],
          paymentSystem:0,
          posModel:0,
          posType:0,
          countryIso:"",
          bonusPayPercent:0,
        },
        items: []
      }
      context.PurchaseContext = PurchaseContextInitialTest
    }),
    // @ts-ignore
    updateCartProductItems: assign((context, event) => {
      // @ts-ignore
      const items = event.event as ICheckItemRequisitesEntity[]
      console.log('PAAAAAAAAYLOAD IN UPDATE ITEMS:::', items)
      context.PurchaseContext.items = items
    }),
  },
});

// TODO: https://github.com/statelyai/xstate/issues/1058
export const AppFlowMachineContext = createContext({} as any);

// Из добро пожаловать и в добро пожаловать
// Из него нельзя выйти пока не произойдет успешная сверка
// Залепить настройку времени
// letsBeginReconcilation

//  Ждать опр времени срабатывания выполняет сверку если не успешен то пробует еще раз и еще раз, общаться с реактом путем ивентов onBegin onEnd
//  Срабатывание сверки не должно влиять на покупку пользователя (запуск только в приглашении к покупке)
//  OnBegin уйти из стейт машины
//  Если ок то выхзодим из стейта сверки итога
//  Если нет то запускаем сверку еще раз, не выходим ихз стейта сверки итогов
//  При старте инициализхировать в .енв время старта сверки итогов
//  Через мост иницилизация по времени сверку итогов

