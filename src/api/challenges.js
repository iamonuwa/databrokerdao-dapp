import _ from 'lodash';

/**
 * API
 */

/**
 * fetches challenges for a listing.
 */
export function fetchChallenges(authenticatedAxiosClient, queryParams) {
  let url = `/challengeregistry/list?${queryParams}`;
  return authenticatedAxiosClient.get(url).then(response => response);
}
