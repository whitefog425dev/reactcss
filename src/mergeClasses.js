import map from 'lodash/map'
import cloneDeep from 'lodash/cloneDeep'
import objectAssign from 'object-assign'

export const mergeClasses = (classes, activeNames = []) => {
  const styles = (classes.default && cloneDeep(classes.default)) || {}
  activeNames.map((name) => {
    const toMerge = classes[name]
    if (toMerge) {
      map(toMerge, (value, key) => {
        if (!styles[key]) {
          styles[key] = {}
        }

        objectAssign(styles[key], toMerge[key])
      })
    }

    return name
  })
  return styles
}

export default mergeClasses
