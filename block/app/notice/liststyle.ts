import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 8,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  dateSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#4b91cd',
    padding: 10,
    borderRadius: 4,
    marginLeft: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#4b91cd',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  headerCell: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  titleHeader: {
    flex: 3,
    textAlign: 'left',
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
  },
  titleCell: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 6,
  },
  titleText: {
    fontSize: 13,
    flexShrink: 1,
  },
  badgeImportant: {
    backgroundColor: '#00BFA5',
    color: 'white',
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 4,
  },
  badgeNew: {
    backgroundColor: '#4b91cd',
    color: 'white',
    fontSize: 11,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  addNoticeButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4b91cd',
    padding: 14,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
  
});

export default styles;
