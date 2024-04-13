
export const graphglPlugin = {
    // Fires whenever a GraphQL request is received from a client.
    async requestDidStart(requestContext) {

      if (requestContext.request.operationName !== 'IntrospectionQuery') {

      console.log('Request started! Query:\n' + JSON.stringify( requestContext.request.query));
      }
      return {
        // Fires whenever Apollo Server will parse a GraphQL
        // request to create its associated document AST.
        async parsingDidStart(requestContext) {
            if (requestContext.request.operationName !== 'IntrospectionQuery') {
              console.log('Parsing started!');
            }
        },
  
        // Fires whenever Apollo Server will validate a
        // request's document AST against your GraphQL schema.
        async validationDidStart(requestContext) {
            if (requestContext.request.operationName !== 'IntrospectionQuery') {
              console.log('Validation started!');
            }
        },
      };
    },
  };
  