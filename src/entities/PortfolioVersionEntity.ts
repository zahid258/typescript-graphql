import { Field, ObjectType } from 'type-graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PageEntity from './PageEntity';
import PortfolioTypeEntity from './PortfolioTypeEntity';

@ObjectType('PortfolioVersion')
@Entity()
export default class PortfolioVersionEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => PageEntity)
  @ManyToOne(() => PageEntity, (page) => page.portfolio)
  page: PageEntity;

  @Field(() => PortfolioTypeEntity)
  @ManyToOne(() => PortfolioTypeEntity, (portfolioType) => portfolioType.portfolioVersions)
  portfolioType: PortfolioTypeEntity;
}
