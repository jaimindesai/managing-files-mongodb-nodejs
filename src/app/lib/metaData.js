
function buildMeta (user, params, options) {

	const metadata = {
		type: params.type,
		ownerID: params.personID
	};
	
	Object.assign(metadata, options);

	if (typeof params.personID !== 'undefined' && params.personID.length > 0) {
		metadata.clientID = params.personID;
	}
	return metadata;
}



module.exports = {
	buildMeta
};