import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository, In } from 'typeorm';
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

    // Query to get all portfolio versions
    @Query(() => [PortfolioVersionEntity])
    async getAllPortfolioVersions(): Promise<PortfolioVersionEntity[]> {
        const portfolioVersionRepository = getRepository(PortfolioVersionEntity);
        const results = await portfolioVersionRepository.find({
            relations: ['page', 'portfolioType', 'page.portfolio']
        });
        return results;
    }

    //get all pages inside the version id
    @Query(() => [PageEntity])
    async getPagesByPortfolioVersion(@Arg('versionId') versionId: number): Promise<PageEntity[]> {
        const portfolioTypeRepository = getRepository(PortfolioTypeEntity);

        // Find the portfolio type with the given versionId
        const parentPortfolioType = await portfolioTypeRepository.findOne({
            where: { id: versionId }
        });

        if (!parentPortfolioType) {
            throw new Error('Portfolio type not found');
        }

        let portfolioTypes: PortfolioTypeEntity[];
        // Extract portfolioType IDs
        let portfolioTypeIds: number[] = [];

        if (parentPortfolioType.parentId === 0) {
            portfolioTypes = await portfolioTypeRepository.find({
                where: [
                    { parentId: versionId }
                ]
            });
            portfolioTypeIds = portfolioTypes.map(pt => pt.id);
            portfolioTypeIds.push(versionId);
        } else {
            portfolioTypeIds.push(versionId);
        }

        const portfolioVersionRepository = getRepository(PortfolioVersionEntity);

        // Find all portfolio versions that match the portfolioType IDs
        const portfolioVersions = await portfolioVersionRepository.find({
            where: { portfolioType: In(portfolioTypeIds) },
            relations: ['page']
        });

        if (portfolioVersions.length === 0) {
            throw new Error('Portfolio versions not found');
        }

        // Extract and return all pages from the found portfolio versions
        return portfolioVersions.map(pv => pv.page);
    }



}
