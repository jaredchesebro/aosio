let callback = () => {};

function containsAOSNode(nodes) {
  let i, currentNode, result;

  for (i = 0; i < nodes.length; i += 1) {
    currentNode = nodes[i];

    if (currentNode.dataset && currentNode.dataset.aos) {
      return true;
    }

    result = currentNode.children && containsAOSNode(currentNode.children);

    if (result) {
      return true;
    }
  }

  return false;
}

function check(mutations) {
  if (!mutations) return;

  mutations.forEach((mutation) => {
    const addedNodes = Array.prototype.slice.call(mutation.addedNodes);
    const removedNodes = Array.prototype.slice.call(mutation.removedNodes);
    const allNodes = addedNodes.concat(removedNodes);

    if (containsAOSNode(allNodes)) {
      return callback();
    }
  });
}

function ready(fn) {
  const observer = new MutationObserver(check);
  callback = fn;

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  return observer;
}

export default { ready };
