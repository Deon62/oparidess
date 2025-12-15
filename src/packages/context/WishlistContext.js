import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [wishlistName, setWishlistName] = useState('');

  const createWishlistFolder = useCallback((name) => {
    const trimmed = String(name || '').trim();
    if (!trimmed) return null;

    const id = `wl-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const folder = {
      id,
      name: trimmed,
      items: [],
      createdAt: new Date().toISOString(),
    };

    setFolders((prev) => [folder, ...prev]);
    return folder;
  }, []);

  const addRecentlyViewed = useCallback((item) => {
    if (!item?.id || !item?.type) return;
    setRecentlyViewed((prev) => {
      const key = `${item.type}:${item.id}`;
      const filtered = prev.filter((x) => `${x.type}:${x.id}` !== key);
      return [
        {
          ...item,
          viewedAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 30);
    });
  }, []);

  const isSaved = useCallback(
    (type, id) => {
      const key = `${type}:${id}`;
      return folders.some((f) => f.items.some((i) => `${i.type}:${i.id}` === key));
    },
    [folders]
  );

  const removeSavedItemEverywhere = useCallback((type, id) => {
    const key = `${type}:${id}`;
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        items: f.items.filter((i) => `${i.type}:${i.id}` !== key),
      }))
    );
  }, []);

  const saveItemToFolder = useCallback((folderId, item) => {
    if (!folderId || !item?.id || !item?.type) return;
    const key = `${item.type}:${item.id}`;

    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== folderId) return f;
        const exists = f.items.some((i) => `${i.type}:${i.id}` === key);
        if (exists) return f;
        return {
          ...f,
          items: [
            {
              ...item,
              savedAt: new Date().toISOString(),
            },
            ...f.items,
          ],
        };
      })
    );
  }, []);

  const openSaveToWishlist = useCallback((item) => {
    setPendingItem(item);
    setWishlistName('');
    setShowSaveModal(true);
  }, []);

  const closeSaveModal = useCallback(() => {
    setShowSaveModal(false);
    setPendingItem(null);
    setWishlistName('');
  }, []);

  const handleCreateAndSave = useCallback(() => {
    const folder = createWishlistFolder(wishlistName);
    if (!folder) return;
    if (pendingItem) {
      saveItemToFolder(folder.id, pendingItem);
    }
    closeSaveModal();
  }, [closeSaveModal, createWishlistFolder, pendingItem, saveItemToFolder, wishlistName]);

  const handleSaveToExisting = useCallback(
    (folderId) => {
      if (pendingItem) {
        saveItemToFolder(folderId, pendingItem);
      }
      closeSaveModal();
    },
    [closeSaveModal, pendingItem, saveItemToFolder]
  );

  const likedCars = useMemo(() => {
    const set = new Set();
    folders.forEach((f) => f.items.forEach((i) => (i.type === 'car' ? set.add(i.id) : null)));
    return set;
  }, [folders]);

  const likedServices = useMemo(() => {
    const set = new Set();
    folders.forEach((f) => f.items.forEach((i) => (i.type === 'service' ? set.add(i.id) : null)));
    return set;
  }, [folders]);

  const likedDiscover = useMemo(() => {
    const set = new Set();
    folders.forEach((f) => f.items.forEach((i) => (i.type === 'discover' ? set.add(i.id) : null)));
    return set;
  }, [folders]);

  const toggleCarLike = useCallback(
    (carId, meta) => {
      if (isSaved('car', carId)) {
        removeSavedItemEverywhere('car', carId);
        return;
      }
      openSaveToWishlist({ type: 'car', id: carId, ...meta });
    },
    [isSaved, openSaveToWishlist, removeSavedItemEverywhere]
  );

  const toggleServiceLike = useCallback(
    (serviceId, meta) => {
      if (isSaved('service', serviceId)) {
        removeSavedItemEverywhere('service', serviceId);
        return;
      }
      openSaveToWishlist({ type: 'service', id: serviceId, ...meta });
    },
    [isSaved, openSaveToWishlist, removeSavedItemEverywhere]
  );

  const toggleDiscoverLike = useCallback(
    (discoverId, meta) => {
      if (isSaved('discover', discoverId)) {
        removeSavedItemEverywhere('discover', discoverId);
        return;
      }
      openSaveToWishlist({ type: 'discover', id: discoverId, ...meta });
    },
    [isSaved, openSaveToWishlist, removeSavedItemEverywhere]
  );

  const value = {
    folders,
    recentlyViewed,
    addRecentlyViewed,
    createWishlistFolder,
    saveItemToFolder,
    removeSavedItemEverywhere,
    isSaved,
    openSaveToWishlist,
    likedCars,
    likedServices,
    likedDiscover,
    toggleCarLike,
    toggleServiceLike,
    toggleDiscoverLike,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <Modal
        visible={showSaveModal}
        transparent
        animationType="slide"
        onRequestClose={closeSaveModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeSaveModal} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Save to wishlist</Text>
              <TouchableOpacity onPress={closeSaveModal} activeOpacity={0.7}>
                <Text style={styles.sheetClose}>×</Text>
              </TouchableOpacity>
            </View>

            {folders.length === 0 ? (
              <>
                <Text style={styles.sectionTitle}>Create wishlist</Text>
                <TextInput
                  value={wishlistName}
                  onChangeText={setWishlistName}
                  placeholder="Name"
                  placeholderTextColor="#9AA4B2"
                  style={styles.input}
                  maxLength={50}
                />
                <View style={styles.counterRow}>
                  <Text style={styles.counterText}>{String(wishlistName || '').length}/50 characters</Text>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={closeSaveModal} activeOpacity={0.8}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.createBtn, !String(wishlistName || '').trim() ? styles.createBtnDisabled : null]}
                    onPress={handleCreateAndSave}
                    activeOpacity={0.85}
                    disabled={!String(wishlistName || '').trim()}
                  >
                    <Text style={styles.createText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Choose wishlist</Text>
                <View style={styles.folderList}>
                  {folders.map((f) => (
                    <TouchableOpacity
                      key={f.id}
                      style={styles.folderRow}
                      onPress={() => handleSaveToExisting(f.id)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.folderName}>{f.name}</Text>
                      <Text style={styles.folderCount}>{f.items.length} saved</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Create wishlist</Text>
                <TextInput
                  value={wishlistName}
                  onChangeText={setWishlistName}
                  placeholder="Name"
                  placeholderTextColor="#9AA4B2"
                  style={styles.input}
                  maxLength={50}
                />
                <View style={styles.counterRow}>
                  <Text style={styles.counterText}>{String(wishlistName || '').length}/50 characters</Text>
                </View>
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={closeSaveModal} activeOpacity={0.8}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.createBtn, !String(wishlistName || '').trim() ? styles.createBtnDisabled : null]}
                    onPress={handleCreateAndSave}
                    activeOpacity={0.85}
                    disabled={!String(wishlistName || '').trim()}
                  >
                    <Text style={styles.createText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </WishlistContext.Provider>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 18,
    paddingBottom: 22,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#0A1D37',
  },
  sheetClose: {
    fontSize: 26,
    lineHeight: 26,
    color: '#0A1D37',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#0A1D37',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(10, 29, 55, 0.22)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#0A1D37',
  },
  counterRow: {
    marginTop: 8,
    marginBottom: 10,
  },
  counterText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#6B7280',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#0A1D37',
    textDecorationLine: 'underline',
  },
  createBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: '#0A1D37',
  },
  createBtnDisabled: {
    backgroundColor: 'rgba(10, 29, 55, 0.20)',
  },
  createText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  folderList: {
    gap: 10,
  },
  folderRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 29, 55, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  folderName: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#0A1D37',
  },
  folderCount: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(10, 29, 55, 0.10)',
    marginVertical: 14,
  },
};

