export default function() {
    this.get('/api/');
    this.get('/api/normalized');
    this.get('/api/normalized/:id');
    this.get('/api/changeset');
    this.get('/api/changeset/:id');
    this.get('/api/change');
    this.get('/api/change/:id');
    this.get('/api/venues');
    this.get('/api/venues/');
    this.get('/api/institutions');
    this.get('/api/institutions/:id');
    this.get('/api/manuscripts');
    this.get('/api/manuscript/:id');
    this.get('/api/preprints');
    this.get('/api/preprints/:id');
    this.get('/api/creative_works');
    this.get('/api/creative_works/:id');
    this.get('/api/tags');
    this.get('/api/tags/:id');
    this.get('/api/taxonomy');
    this.get('/api/taxonomy/:id');
    this.get('/api/data-providers');
    this.get('/api/data-providers/:id');
    this.get('/api/awards');
    this.get('/api/awards/:id');
    this.get('/api/funders');
    this.get('/api/funders/:id');
    this.get('/api/raw');
    this.get('/api/raw/:id');
}