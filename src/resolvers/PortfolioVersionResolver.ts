import { Arg, Mutation, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import PortfolioVersionEntity from '../entities/PortfolioVersionEntity';
import PageEntity from '../entities/PageEntity';
import PortfolioTypeEntity from '../entities/PortfolioTypeEntity';
import { Service } from 'typedi';

@Resolver()
@Service()
export class PortfolioVersionResolver {
    @Mutation(() => PortfolioVersionEntity)
    async createSnapshotVersion(
        @Arg('pageId') pageId: number,
        @Arg('portfolioTypeId') portfolioTypeId: number
    ): Promise<PortfolioVersionEntity> {
        const portfolioVersionRepository = getRepository(PortfolioVersionEntity);
        const pageRepository = getRepository(PageEntity);
        const portfolioTypeRepository = getRepository(PortfolioTypeEntity);

        // Find the existing draft version
        const draftVersion = await portfolioVersionRepository.findOne({
            where: {
                page: { id: pageId },
                portfolioType: { id: portfolioTypeId }
            },
            relations: ['page', 'portfolioType']
        });

        if (draftVersion) {
            throw new Error('Draft version already exists');
        }

        // Get the page and portfolio type entities
        const page = await pageRepository.findOne(pageId);
        const portfolioType = await portfolioTypeRepository.findOne(portfolioTypeId);

        if (!page || !portfolioType) {
            throw new Error('Page or Portfolio Type not found');
        }

        // Create a new snapshot version
        const snapshotVersion = portfolioVersionRepository.create({
            page: page,
            portfolioType: portfolioType
        });

        // Save the new snapshot version
        await portfolioVersionRepository.save(snapshotVersion);

        return snapshotVersion;
    }
}
