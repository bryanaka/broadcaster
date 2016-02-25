import config         from 'broadcaster/config/environment';
import { skip, test } from 'qunit';

const TEST_TAGS = config.TEST_TAGS;

function taggedTest(tag, description, callback) {
  if(tag instanceof Array) {
    return multiTagTest(tag, description, callback);
  }

  if(TEST_TAGS[tag.toUpperCase()] !== 'true') {
    return skip(`${tag} tag disabled: ${description}`, callback);
  }

  return test(description, callback);
}

function multiTagTest(tags, description, callback) {
  var matchedTag = tags.some( (currentTag) => {
    return TEST_TAGS[currentTag.toUpperCase()] === 'true';
  });

  if(matchedTag) {
    return test(description, callback);
  } else {
    return skip(description, callback);
  }
}

function createTaggedTestType(tag) {
  return function(description, callback) {
    return taggedTest(tag, description, callback);
  };
}

var integrationTest = createTaggedTestType('integration');

export default taggedTest;
export { taggedTest, createTaggedTestType, integrationTest };
