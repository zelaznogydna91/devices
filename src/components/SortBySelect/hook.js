/* eslint-disable no-plusplus */
import {
  useReducer, useMemo, useEffect, useRef,
} from 'react'
import isEqual from 'lodash/isEqual'

/*

criteriaData: PropTypes.arrayOf(PropTypes.shape({
    key:  {
      active:  PropTypes.bool.isRequired,
      ascendingOrder: PropTypes.bool.isRequired,
    }
  })),

 */

const defaultCriterionState = {
  active:         false,
  ascendingOrder: true,
  order:          0,
}

const initialState = {
  nextOrder:              1,
  criteriaKeys:           [],
  isDirty:                false,
  clearable:              false,
  initialCriteriaOptions: {},
  newCriteriaOptions:     false,
}

const ReactionTypes = {
  setCriteriaOptions:     'setCriteriaOptions',
  setAscending:           'setAscending',
  setDescending:          'setDescending',
  turnOffActiveCriterion: 'turnOffActiveCriterion',
  setNextCriterionStep:   'setNextCriterionStep',
  clear:                  'clear',
}

const getCriterion = (state, criterionKey) => state.newCriteriaOptions[criterionKey]

const isDefined = (o) => o !== undefined

const isChanging = (initial, update) => (
  (isDefined(update.active) && initial.active !== update.active)
  || (isDefined(update.ascendingOrder) && initial.ascendingOrder !== update.ascendingOrder)
)

const check = (state, nextState) => {
  let isDirty = false
  let clearable = false
  state.criteriaKeys.forEach((criterionKey) => {
    const initialCriterion = state.initialCriteriaOptions[criterionKey]
    const newCriterion = nextState.newCriteriaOptions[criterionKey]
    if (isChanging(initialCriterion, newCriterion)) isDirty = true
    if (newCriterion.active) clearable = true
  })
  return { ...nextState, isDirty, clearable }
}

const updateCriterion = (update) => (state, criterionKey) => check(state, {
  ...state,
  newCriteriaOptions: {
    ...state.newCriteriaOptions,
    [criterionKey]: {
      ...state.newCriteriaOptions[criterionKey],
      ...update,
    },
  },
})

const ascend = updateCriterion(
  { active: true, ascendingOrder: true },
)

const descend = updateCriterion(
  { active: true, ascendingOrder: false },
)

const turnOff = updateCriterion(
  { ...defaultCriterionState },
)

const reducer = (state, action) => {
  switch (action.type) {
    case ReactionTypes.setCriteriaOptions: {
      let clearable = false
      const initialCriteriaOptions = action.criteriaKeys.reduce((map, criterionKey) => {
        const criterionState = { ...defaultCriterionState }
        const criterionRef = action.criteriaOptions.find((c) => c.key === criterionKey)

        if (criterionRef) {
          criterionState.active = criterionRef.active
          criterionState.ascendingOrder = criterionRef.ascendingOrder
          criterionState.order = criterionRef.order
          if (criterionRef.active) clearable = true
        }

        return Object.assign(map, { [criterionKey]: criterionState })
      }, {})

      return {
        ...state,
        criteriaKeys:       action.criteriaKeys,
        clearable,
        isDirty:            false,
        initialCriteriaOptions,
        newCriteriaOptions: { ...initialCriteriaOptions },
      }
    }

    case ReactionTypes.setAscending:
      return ascend(state, action.criterionKey)

    case ReactionTypes.setDescending:
      return descend(state, action.criterionKey)

    case ReactionTypes.turnOffActiveCriterion:
      return turnOff(state, action.criterionKey)

    case ReactionTypes.setNextCriterionStep: {
      const { criterionKey } = action
      const criterion = getCriterion(state, criterionKey)
      switch (true) {
        case !criterion.active: {
          const nextState = ascend(state, criterionKey)
          nextState.newCriteriaOptions[criterionKey].order = nextState.nextOrder++
          return nextState
        }

        case criterion.ascendingOrder:
          return descend(state, criterionKey)
        default:
        {
          const nextState = turnOff(state, criterionKey)
          state.criteriaKeys.forEach(
            (key) => {
              const c = nextState.newCriteriaOptions[key]
              if (c.active && c.order > 1) c.order -= 1
            },
          )
          if (nextState.nextOrder > 1) nextState.nextOrder -= 1
          return nextState
        }
      }
    }

    case ReactionTypes.clear: {
      const cleared = state.criteriaKeys.reduce(
        (map, criterionKey) => Object.assign(map, { [criterionKey]: { ...defaultCriterionState } }),
        {},
      )
      return {
        ...state,
        isDirty:            !isEqual(state.initialCriteriaOptions, cleared),
        clearable:          false,
        newCriteriaOptions: cleared,
        nextOrder:          1,
      }
    }

    default:
      break
  }
  return state
}

const userActions = (dispatch, handlers, stateRef) => {
  const setAscending = (criterionKey) => {
    dispatch({ type: ReactionTypes.setAscending, criterionKey })
  }

  const setDescending = (criterionKey) => {
    dispatch({ type: ReactionTypes.setDescending, criterionKey })
  }

  const turnOffActiveCriterion = (criterionKey) => {
    dispatch({ type: ReactionTypes.turnOffActiveCriterion, criterionKey })
  }

  return {
    setAscending,
    setDescending,
    turnOffActiveCriterion,
    setCriteriaOptions: (criteriaKeys, criteriaOptions) => {
      dispatch({ type: ReactionTypes.setCriteriaOptions, criteriaKeys, criteriaOptions })
    },
    setNextCriterionStep: (criterionKey) => {
      dispatch({ type: ReactionTypes.setNextCriterionStep, criterionKey })
    },
    applyNewCriteriaOptions: () => {
      debugger
      const criteriaToApply = Object
        .entries(stateRef.current.newCriteriaOptions)
        .map(([key, state]) => ({ key, ...state }))
        .filter((c) => c.active)
        .sort((x, y) => x.order - y.order)
      debugger
      handlers.onApply(criteriaToApply)
    },
    clear: () => {
      dispatch({ type: ReactionTypes.clear })
      // handlers.onClear()
    },
  }
}

const useSortBySelect = (criteriaKeys, criteriaOptions, handlers) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const stateRef = useRef()
  stateRef.current = state
  const actions = useMemo(() => userActions(dispatch, handlers, stateRef), [])

  useEffect(() => {
    actions.setCriteriaOptions(criteriaKeys, criteriaOptions)
  }, [criteriaOptions])

  return [state, actions]
}

export default useSortBySelect
