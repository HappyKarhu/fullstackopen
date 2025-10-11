const initialState = {//if redux calls without state, thisis a starting point
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)//object tells what happende-esim:type good
  switch (action.type ) {//switch looks at action.type and decides ghow to create new state
    case 'GOOD':
      return { 
        ...state, 
        good: state.good + 1 
      }
    case 'OK':
      return { 
        ...state, 
        ok: state.ok + 1 
      }
    case 'BAD':
      return { 
        ...state, 
        bad: state.bad + 1 
      }
    case 'ZERO':
      return initialState
      
    default: return state
  }
  
}

export default counterReducer
