import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import PortfolioVersionEntity from './PortfolioVersionEntity';

@ObjectType('PortfolioType')
@Entity()
export default class PortfolioTypeEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { nullable: false })
  name: string;

  @Field()
  @Column('integer', { default: 0 })
  parentId: number;

  @Field(() => [PortfolioVersionEntity])
  @OneToMany(() => PortfolioVersionEntity, (portfolioVersion) => portfolioVersion)
  portfolioVersions: PortfolioVersionEntity[];
}
