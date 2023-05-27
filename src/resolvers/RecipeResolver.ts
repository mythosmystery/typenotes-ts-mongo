import { Resolver, Query } from 'type-graphql';
import { Recipe } from '../models';

@Resolver(Recipe)
export class RecipeResolver {
  @Query(returns => [Recipe])
  recipes() {
    return [
      { id: 1, title: 'Recipe 1', description: 'Description 1' },
      { id: 2, title: 'Recipe 2', description: 'Description 2' },
    ];
  }
}
