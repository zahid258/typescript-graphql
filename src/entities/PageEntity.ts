import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import PortfolioEntity from './PortfolioEntity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType('Page')
@Entity()
export default class PageEntity {

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { nullable: false })
  name: string;


  @Field()
  @Column('varchar', { nullable: false, unique: true })
  url: string;


  @Field(() => PortfolioEntity)
  @ManyToOne(() => PortfolioEntity, { nullable: false })
  portfolio: PortfolioEntity;
}
