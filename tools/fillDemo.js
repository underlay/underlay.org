import { Member, User, Organization, Package, Discussion, Assertion } from 'server/models';
import {
	users,
	organizations,
	buildMembers,
	buildPackages,
	buildDiscussions,
	buildAssertions,
} from './fillDemoData';

const run = async () => {
	const userObjects = await User.bulkCreate(users);
	const organizationObjects = await Organization.bulkCreate(organizations);
	const packagesData = await Package.bulkCreate(buildPackages(userObjects, organizationObjects));
	await Member.bulkCreate(buildMembers(userObjects, organizationObjects));
	await Discussion.bulkCreate(buildDiscussions(userObjects, organizationObjects, packagesData));
	await Assertion.bulkCreate(buildAssertions(userObjects, packagesData));
};

console.info('Beginning script');
run()
	.catch((err) => {
		console.info('Error script', err);
	})
	.finally(() => {
		console.info('Ending script');
		process.exit();
	});
